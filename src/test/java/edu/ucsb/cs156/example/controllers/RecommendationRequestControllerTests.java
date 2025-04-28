package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;

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

@WebMvcTest(controllers = RecommendationRequestController.class)
@Import(TestConfig.class)
public class RecommendationRequestControllerTests extends ControllerTestCase {
    @MockBean
    RecommendationRequestRepository recommendationRequestRepository;
    @MockBean
    UserRepository userRepository;

    // Authorization tests for /api/recommendation-requests/all
    @Test
    public void logged_out_users_cannot_get_all() throws Exception {
            mockMvc.perform(get("/api/recommendation-requests/all"))
                            .andExpect(status().is(403)); // logged out users can't get all
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_users_can_get_all() throws Exception {
            mockMvc.perform(get("/api/recommendation-requests/all"))
                            .andExpect(status().is(200)); // logged
    }

    // Authorization tests for /api/recommendation-requests/post

    @Test
    public void logged_out_users_cannot_post() throws Exception {
            mockMvc.perform(post("/api/recommendation-requests/post"))
                            .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_regular_users_cannot_post() throws Exception {
            mockMvc.perform(post("/api/recommendation-requests/post"))
                            .andExpect(status().is(403)); // only admins can post
    }

    // Tests with mocks for database actions
    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_user_can_get_all_recommendation_requests() throws Exception {
            // arrange
            LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

            RecommendationRequest recommendationRequest1 = RecommendationRequest.builder()
                            .requesterEmail("student1@ucsb.edu")
                            .professorEmail("prof1@ucsb.edu")
                            .explanation("grad program")
                            .dateRequested(ldt1)
                            .dateNeeded(ldt1.plusDays(5))
                            .done(false)
                            .build();

            LocalDateTime ldt2 = LocalDateTime.parse("2022-03-11T00:00:00");

            RecommendationRequest recommendationRequest2 = RecommendationRequest.builder()
                            .requesterEmail("student2@ucsb.edu")
                            .professorEmail("prof2@ucsb.edu")
                            .explanation("grad program")
                            .dateRequested(ldt2)
                            .dateNeeded(ldt2.plusDays(5))
                            .done(false)
                            .build();

            ArrayList<RecommendationRequest> expectedRecommendationRequests = new ArrayList<>();
            expectedRecommendationRequests.addAll(Arrays.asList(recommendationRequest1, recommendationRequest2));

            when(recommendationRequestRepository.findAll()).thenReturn(expectedRecommendationRequests);

            // act
            MvcResult response = mockMvc.perform(get("/api/recommendation-requests/all"))
                            .andExpect(status().isOk()).andReturn();

            // assert
            verify(recommendationRequestRepository, times(1)).findAll();
            String expectedJson = mapper.writeValueAsString(expectedRecommendationRequests);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_recommendation_request() throws Exception {
            // arrange
            LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

            RecommendationRequest recommendationRequest1 = RecommendationRequest.builder()
                            .requesterEmail("student1@ucsb.edu")
                            .professorEmail("prof1@ucsb.edu")
                            .explanation("grad program")
                            .dateRequested(ldt1)
                            .dateNeeded(ldt1.plusDays(5))
                            .done(false)
                            .build();

            when(recommendationRequestRepository.save(eq(recommendationRequest1))).thenReturn(recommendationRequest1);

            // act
            MvcResult response = mockMvc.perform(
                            post("/api/recommendation-requests/post?requesterEmail=student1@ucsb.edu&professorEmail=prof1@ucsb.edu&explanation=grad program&dateRequested=2022-01-03T00:00:00&dateNeeded=2022-01-08T00:00:00&done=false")
                                            .with(csrf()))
                            .andExpect(status().isOk()).andReturn();

            // assert
            verify(recommendationRequestRepository, times(1)).save(recommendationRequest1);
            String expectedJson = mapper.writeValueAsString(recommendationRequest1);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);
    }


    // Authorization tests for GET /api/RecommendationRequest?id=123 : when record exists, and when it does not exist
    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_exists_recreq() throws Exception {

         // arrange
        LocalDateTime ldt = LocalDateTime.parse("2022-01-03T00:00:00");

        RecommendationRequest recommendationRequest = RecommendationRequest.builder()
                        .requesterEmail("student1@ucsb.edu")
                        .professorEmail("prof1@ucsb.edu")
                        .explanation("grad program")
                        .dateRequested(ldt)
                        .dateNeeded(ldt.plusDays(5))
                        .done(false)
                        .build();

        when(recommendationRequestRepository.findById(123L)).thenReturn(Optional.of(recommendationRequest));

        // act
        MvcResult response = mockMvc.perform(get("/api/recommendation-requests?id=123")).andExpect(status().isOk()).andReturn();
        // assert

        verify(recommendationRequestRepository, times(1)).findById(123L);
        String expectedJson = mapper.writeValueAsString(recommendationRequest);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
      }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist_recreq() throws Exception {

        // arrange
        when(recommendationRequestRepository.findById(123L)).thenReturn(Optional.empty());


        // act
        MvcResult response = mockMvc.perform(get("/api/recommendation-requests?id=123")).andExpect(status().isNotFound()).andReturn();

        // assert

        verify(recommendationRequestRepository, times(1)).findById(123L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("RecommendationRequest with id 123 not found", json.get("message"));
        }


        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_recommendation_request() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                RecommendationRequest recommendationRequest1 = RecommendationRequest.builder()
                                .requesterEmail("stud1@ucsb.edu")
                                .professorEmail("prof1@ucsb.edu")
                                .explanation("grad program")
                                .dateRequested(ldt1)
                                .dateNeeded(ldt1.plusDays(5))
                                .done(false)
                                .build();

                when(recommendationRequestRepository.findById(eq(15L))).thenReturn(Optional.of(recommendationRequest1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/recommendation-requests?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(recommendationRequestRepository, times(1)).findById(15L);
                verify(recommendationRequestRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("RecommendationRequest with id 15 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_recommendation_request_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(recommendationRequestRepository.findById(eq(15L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/recommendation-requests?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(recommendationRequestRepository, times(1)).findById(15L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("RecommendationRequest with id 15 not found", json.get("message"));
        }


        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_recommendation_request() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
                LocalDateTime ldt2 = LocalDateTime.parse("2023-01-03T00:00:00");

                RecommendationRequest recommendationRequestOrig = RecommendationRequest.builder()
                                .requesterEmail("stud1@ucsb.edu")
                                .professorEmail("prof1@ucsb.edu")
                                .explanation("grad school")
                                .dateRequested(ldt1)
                                .dateNeeded(ldt1.plusDays(5))
                                .done(false)
                                .build();

                RecommendationRequest recommendationRequestEdited = RecommendationRequest.builder()
                                .requesterEmail("stud2@ucsb.edu")
                                .professorEmail("prof2@ucsb.edu")
                                .explanation("grad school")
                                .dateRequested(ldt2)
                                .dateNeeded(ldt2.plusDays(5))
                                .done(true)
                                .build();

                String requestBody = mapper.writeValueAsString(recommendationRequestEdited);

                when(recommendationRequestRepository.findById(eq(67L))).thenReturn(Optional.of(recommendationRequestOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/recommendation-requests?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(recommendationRequestRepository, times(1)).findById(67L);
                verify(recommendationRequestRepository, times(1)).save(recommendationRequestEdited);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_recommendation_request_that_does_not_exist() throws Exception {
                
                // arrange
                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                RecommendationRequest recommendationRequestEdited = RecommendationRequest.builder()
                                .requesterEmail("stud1@ucsb.edu")
                                .professorEmail("prof1@ucsb.edu")
                                .explanation("grad school")
                                .dateRequested(ldt1)
                                .dateNeeded(ldt1.plusDays(5))
                                .done(false)
                                .build();

                String requestBody = mapper.writeValueAsString(recommendationRequestEdited);

                when(recommendationRequestRepository.findById(eq(67L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/recommendation-requests?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(recommendationRequestRepository, times(1)).findById(67L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("RecommendationRequest with id 67 not found", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_update_text_field_in_recommendation_request() throws Exception {
        // Arrange
        LocalDateTime ldt = LocalDateTime.parse("2022-01-03T00:00:00");

        RecommendationRequest original = RecommendationRequest.builder()
                .requesterEmail("stud@ucsb.edu")
                .professorEmail("prof@ucsb.edu")
                .explanation("grad school")
                .dateRequested(ldt)
                .dateNeeded(ldt.plusDays(7))
                .done(false)
                .build();

        RecommendationRequest updated = RecommendationRequest.builder()
                .requesterEmail("stud@ucsb.edu")
                .professorEmail("prof@ucsb.edu")
                .explanation("phd program")
                .dateRequested(ldt)
                .dateNeeded(ldt.plusDays(7))
                .done(false)
                .build();

        String requestBody = mapper.writeValueAsString(updated);

        when(recommendationRequestRepository.findById(eq(42L))).thenReturn(Optional.of(original));
        when(recommendationRequestRepository.save(any(RecommendationRequest.class))).thenReturn(updated);

        // Act
        MvcResult response = mockMvc.perform(
                put("/api/recommendation-requests?id=42")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andReturn();

        // Assert
        verify(recommendationRequestRepository, times(1)).findById(42L);
        verify(recommendationRequestRepository, times(1)).save(any(RecommendationRequest.class));

        String responseString = response.getResponse().getContentAsString();
        assertEquals(requestBody, responseString);
        }
}