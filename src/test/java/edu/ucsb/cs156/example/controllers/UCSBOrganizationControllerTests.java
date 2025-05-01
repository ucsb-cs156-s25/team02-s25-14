package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.UCSBOrganization;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationsRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;

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

import java.time.LocalDateTime;

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
    UCSBOrganizationsRepository ucsbOrganizationRepository;
    @MockBean
    UserRepository userRepository;

    // Authorization tests for /api/ucsborganizations/all
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

    // Authorization tests for /api/ucsborganizations/post

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

    // Tests with mocks for database actions
    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_user_can_get_all_ucsborganizations() throws Exception {
            // arrange
            LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

            UCSBOrganization ucsbOrganization1 = UCSBOrganization.builder()
                            .orgCode("student1@ucsb.edu")
                            .orgTranslationShort("prof1@ucsb.edu")
                            .orgTranslation("grad program")
                            .inactive(false)
                            .build();

            LocalDateTime ldt2 = LocalDateTime.parse("2022-03-11T00:00:00");

            UCSBOrganization ucsbOrganization2 = UCSBOrganization.builder()
                            .orgCode("student2@ucsb.edu")
                            .orgTranslationShort("prof2@ucsb.edu")
                            .orgTranslation("grad program")
                            .inactive(false)
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
    public void admin_can_post_a_new_ucsborganization() throws Exception {
            // arrange

            UCSBOrganization ucsbOrganization1 = UCSBOrganization.builder()
                            .orgCode("student1@ucsb.edu")
                            .orgTranslationShort("prof1@ucsb.edu")
                            .orgTranslation("grad program")
                            .inactive(false)
                            .build();

            when(ucsbOrganizationRepository.save(eq(ucsbOrganization1))).thenReturn(ucsbOrganization1);

            // act
            MvcResult response = mockMvc.perform(
                            post("/api/ucsborganizations/post?orgCode=student1@ucsb.edu&orgTranslationShort=prof1@ucsb.edu&orgTranslation=grad program&inactive=false")
                                            .with(csrf()))
                            .andExpect(status().isOk()).andReturn();

            // assert
            verify(ucsbOrganizationRepository, times(1)).save(ucsbOrganization1);
            String expectedJson = mapper.writeValueAsString(ucsbOrganization1);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

         // arrange
        UCSBOrganization ucsbOrganization = UCSBOrganization.builder()
                        .orgCode("student1@ucsb.edu")
                        .orgTranslationShort("prof1@ucsb.edu")
                        .orgTranslation("grad program")
                        .inactive(false)
                        .build();

        when(ucsbOrganizationRepository.findById(eq("student1@ucsb.edu"))).thenReturn(Optional.of(ucsbOrganization));

        // act
        MvcResult response = mockMvc.perform(get("/api/ucsborganizations?orgCode=student1@ucsb.edu"))
                            .andExpect(status().isOk()).andReturn();

        // assert
        verify(ucsbOrganizationRepository, times(1)).findById("student1@ucsb.edu");
        String expectedJson = mapper.writeValueAsString(ucsbOrganization);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

        // arrange
        when(ucsbOrganizationRepository.findById(eq("fake-code"))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(get("/api/ucsborganizations?orgCode=fake-code"))
                            .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(ucsbOrganizationRepository, times(1)).findById("fake-code");
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("UCSBOrganization with id fake-code not found", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_delete_a_ucsborganization() throws Exception {
            // arrange

            UCSBOrganization ucsbOrganization1 = UCSBOrganization.builder()
                            .orgCode("stud1@ucsb.edu")
                            .orgTranslationShort("prof1@ucsb.edu")
                            .orgTranslation("grad program")
                            .inactive(false)
                            .build();

            when(ucsbOrganizationRepository.findById(eq("stud1@ucsb.edu"))).thenReturn(Optional.of(ucsbOrganization1));

            // act
            MvcResult response = mockMvc.perform(
                            delete("/api/ucsborganizations?orgCode=stud1@ucsb.edu")
                                            .with(csrf()))
                            .andExpect(status().isOk()).andReturn();

            // assert
            verify(ucsbOrganizationRepository, times(1)).findById("stud1@ucsb.edu");
            verify(ucsbOrganizationRepository, times(1)).delete(ucsbOrganization1);

            Map<String, Object> json = responseToJson(response);
            assertEquals("UCSBOrganization with id stud1@ucsb.edu deleted", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_tries_to_delete_non_existant_ucsborganization_and_gets_right_error_message() throws Exception {
            // arrange
            when(ucsbOrganizationRepository.findById(eq("fake-code"))).thenReturn(Optional.empty());

            // act
            MvcResult response = mockMvc.perform(
                            delete("/api/ucsborganizations?orgCode=fake-code")
                                            .with(csrf()))
                            .andExpect(status().isNotFound()).andReturn();

            // assert
            verify(ucsbOrganizationRepository, times(1)).findById("fake-code");
            Map<String, Object> json = responseToJson(response);
            assertEquals("UCSBOrganization with id fake-code not found", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_edit_an_existing_ucsborganization() throws Exception {
            // arrange
            UCSBOrganization ucsbOrganizationOrig = UCSBOrganization.builder()
                            .orgCode("stud1@ucsb.edu")
                            .orgTranslationShort("prof1@ucsb.edu")
                            .orgTranslation("grad program")
                            .inactive(false)
                            .build();

            UCSBOrganization ucsbOrganizationEdited = UCSBOrganization.builder()
                            .orgCode("stud1@ucsb.edu")
                            .orgTranslationShort("prof2@ucsb.edu")
                            .orgTranslation("undergrad program")
                            .inactive(true)
                            .build();

            String requestBody = mapper.writeValueAsString(ucsbOrganizationEdited);

            when(ucsbOrganizationRepository.findById(eq("stud1@ucsb.edu"))).thenReturn(Optional.of(ucsbOrganizationOrig));

            // act
            MvcResult response = mockMvc.perform(
                            put("/api/ucsborganizations?orgCode=stud1@ucsb.edu")
                                            .contentType(MediaType.APPLICATION_JSON)
                                            .characterEncoding("utf-8")
                                            .content(requestBody)
                                            .with(csrf()))
                            .andExpect(status().isOk()).andReturn();

            // assert
            verify(ucsbOrganizationRepository, times(1)).findById("stud1@ucsb.edu");
            verify(ucsbOrganizationRepository, times(1)).save(ucsbOrganizationEdited); // should be saved with updated info
            String responseString = response.getResponse().getContentAsString();
            assertEquals(requestBody, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_cannot_edit_ucsborganization_that_does_not_exist() throws Exception {
            // arrange
            UCSBOrganization ucsbOrganizationEdited = UCSBOrganization.builder()
                            .orgCode("fake-code")
                            .orgTranslationShort("prof1@ucsb.edu")
                            .orgTranslation("grad program")
                            .inactive(false)
                            .build();

            String requestBody = mapper.writeValueAsString(ucsbOrganizationEdited);

            when(ucsbOrganizationRepository.findById(eq("fake-code"))).thenReturn(Optional.empty());

            // act
            MvcResult response = mockMvc.perform(
                            put("/api/ucsborganizations?orgCode=fake-code")
                                            .contentType(MediaType.APPLICATION_JSON)
                                            .characterEncoding("utf-8")
                                            .content(requestBody)
                                            .with(csrf()))
                            .andExpect(status().isNotFound()).andReturn();

            // assert
            verify(ucsbOrganizationRepository, times(1)).findById("fake-code");
            Map<String, Object> json = responseToJson(response);
            assertEquals("UCSBOrganization with id fake-code not found", json.get("message"));
    }
}