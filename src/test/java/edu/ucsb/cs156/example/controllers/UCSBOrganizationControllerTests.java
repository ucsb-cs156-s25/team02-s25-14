package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.UCSBOrganization;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.entities.Restaurant;
import edu.ucsb.cs156.example.repositories.RestaurantRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = UCSBOrganizationController.class)
@Import(TestConfig.class)
public class UCSBOrganizationControllerTests extends ControllerTestCase {

        @MockBean
        UCSBOrganizationRepository ucsbOrganizationRepository;

        @MockBean
        UserRepository userRepository;

        // Authorization tests for /api/phones/admin/all

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/ucsborganizations/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/ucsborganizations/all"))
                                .andExpect(status().is(200)); // logged
        }

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/ucsborganizations?orgCode=CS156"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        // Authorization tests for /api/phones/post
        // (Perhaps should also have these for put and delete)

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/ucsborganizations/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/ucsborganizations/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        // // Tests with mocks for database actions

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange

                UCSBOrganization ucsbOrganization = UCSBOrganization.builder()
                                .orgCode("CS156")
                                .orgTranslationShort("CS156")
                                .orgTranslation("Computer Science 156")
                                .build();

                when(ucsbOrganizationRepository.findById(eq("CS156"))).thenReturn(Optional.of(ucsbOrganization));  // Check not sure why id is 7

                // act
                MvcResult response = mockMvc.perform(get("/api/ucsborganizations?orgCode=CS156"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(ucsbOrganizationRepository, times(1)).findById(eq("CS156"));
                String expectedJson = mapper.writeValueAsString(ucsbOrganization);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(ucsbOrganizationRepository.findById(eq("CS156"))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/ucsborganizations?orgCode=CS156"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(ucsbOrganizationRepository, times(1)).findById(eq("CS156"));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("UCSBOrganization with id CS156 not found", json.get("message"));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_ucsborganizations() throws Exception {

                // arrange

                UCSBOrganization ucsbOrganization1 = UCSBOrganization.builder()
                                .orgCode("CS156")
                                .orgTranslationShort("CS156")
                                .orgTranslation("Computer Science 156")
                                .build();

                UCSBOrganization ucsbOrganization2 = UCSBOrganization.builder()
                                .orgCode("CS157")
                                .orgTranslationShort("CS157")
                                .orgTranslation("Computer Science 157")
                                .build();

                ArrayList<UCSBOrganization> expectedUCSBOrganizations = new ArrayList<>();
                expectedUCSBOrganizations.addAll(Arrays.asList(ucsbOrganization1, ucsbOrganization2));

                when(ucsbOrganizationRepository.findAll()).thenReturn(expectedUCSBOrganizations);

                // act
                MvcResult response = mockMvc.perform(get("/api/ucsborganizations/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(ucsbOrganizationRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedUCSBOrganizations);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_ucsborganization() throws Exception {
                // arrange

                UCSBOrganization ucsbOrganization1 = UCSBOrganization.builder()
                                .orgCode("CS156")
                                .orgTranslationShort("CS156")
                                .orgTranslation("Computer Science 156")
                                .build();

                when(ucsbOrganizationRepository.save(eq(ucsbOrganization1))).thenReturn(ucsbOrganization1);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/ucsborganizations/post?orgCode=CS156&orgTranslationShort=CS156&orgTranslation=Computer Science 156")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(ucsbOrganizationRepository, times(1)).save(ucsbOrganization1);
                String expectedJson = mapper.writeValueAsString(ucsbOrganization1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_ucsborganization() throws Exception {
                // arrange
                UCSBOrganization ucsbOrganization = UCSBOrganization.builder()
                                .orgCode("CS156")
                                .orgTranslationShort("CS156")
                                .orgTranslation("Computer Science 156")
                                .build();

                when(ucsbOrganizationRepository.findById(eq("CS156"))).thenReturn(Optional.of(ucsbOrganization));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/ucsborganizations?orgCode=CS156")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(ucsbOrganizationRepository, times(1)).findById("CS156");
                verify(ucsbOrganizationRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("UCSBOrganization with id CS156 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_ucsborganization_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(ucsbOrganizationRepository.findById(eq("CS156"))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/ucsborganizations?orgCode=CS156")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(ucsbOrganizationRepository, times(1)).findById("CS156");
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("UCSBOrganization with id CS156 not found", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_ucsborganization() throws Exception {
                // arrange
                UCSBOrganization ucsbOrganizationOrig = UCSBOrganization.builder()
                                .orgCode("CS156")
                                .orgTranslationShort("CS156")
                                .orgTranslation("Computer Science 156")
                                .build();

                UCSBOrganization ucsbOrganizationEdited = UCSBOrganization.builder()
                                .orgCode("CS156")
                                .orgTranslationShort("CS156")
                                .orgTranslation("Computer Science 156")
                                .build();

                String requestBody = mapper.writeValueAsString(ucsbOrganizationEdited);

                when(ucsbOrganizationRepository.findById(eq("CS156"))).thenReturn(Optional.of(ucsbOrganizationOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/ucsborganizations?orgCode=CS156")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(ucsbOrganizationRepository, times(1)).findById("CS156");
                verify(ucsbOrganizationRepository, times(1)).save(ucsbOrganizationEdited);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_ucsborganization_that_does_not_exist() throws Exception {
                // arrange

                UCSBOrganization editedUCSBOrganization = UCSBOrganization.builder()
                                .orgCode("CS156")
                                .orgTranslationShort("CS156")
                                .orgTranslation("Computer Science 156")
                               
                                .build();


                String requestBody = mapper.writeValueAsString(editedUCSBOrganization);

                when(ucsbOrganizationRepository.findById(eq("CS156"))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/ucsborganizations?orgCode=CS156")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(ucsbOrganizationRepository, times(1)).findById("CS156");
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("UCSBOrganization with id CS156 not found", json.get("message"));

        }
}
