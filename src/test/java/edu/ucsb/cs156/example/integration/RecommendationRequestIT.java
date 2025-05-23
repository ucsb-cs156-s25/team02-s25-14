package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.hamcrest.Matchers.containsString;

import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;

import java.time.LocalDateTime;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)

/*
    This is a Integration Test class for the RecommendationRequest controller.
    REFERENCES: 
    - https://www.geeksforgeeks.org/testing-in-spring-boot/
    - https://www.geeksforgeeks.org/spring-boot-mockmvc-example/
    - https://www.geeksforgeeks.org/crud-junit-tests-for-spring-data-jpa/
*/

public class RecommendationRequestIT {
    @Autowired
    RecommendationRequestRepository recommendationRequestRepository;

    @Autowired
    public MockMvc mockMvc;

    @WithMockUser(roles = { "USER" })
    @Test
    public void get_recommendation_requests() throws Exception {
        recommendationRequestRepository.deleteAll();

        // arrange
        RecommendationRequest recommendationRequest = RecommendationRequest.builder()
            .requesterEmail("chloe@ucsb.edu")
            .professorEmail("prof@ucsb.edu")
            .explanation("grad school")
            .dateRequested(LocalDateTime.parse("2025-05-01T10:00:00"))
            .dateNeeded(LocalDateTime.parse("2025-06-01T10:00:00"))
            .done(false)
            .build();
                        
        recommendationRequestRepository.save(recommendationRequest);

        mockMvc.perform(get("/api/recommendation-requests/all"))
            .andExpect(status().isOk())
            .andExpect(content().string(containsString("chloe@ucsb.edu")))
            .andExpect(content().string(containsString("grad school")))
            .andExpect(content().string(containsString("2025-05-01T10:00:00")));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void post_recommendation_request() throws Exception {
        MvcResult response = mockMvc.perform(
            post("/api/recommendation-requests/post")
                .param("requesterEmail", "chloe@ucsb.edu")
                .param("professorEmail", "prof@ucsb.edu")
                .param("explanation", "grad school")
                .param("dateRequested", "2025-05-01T10:00:00")
                .param("dateNeeded", "2025-06-01T10:00:00")
                .param("done", "false")
                .with(csrf()))
            .andExpect(status().isOk())
            .andExpect(content().string(containsString("chloe@ucsb.edu")))
            .andExpect(content().string(containsString("grad school")))
            .andReturn();

        String responseString = response.getResponse().getContentAsString();

        assert(responseString.contains("chloe@ucsb.edu"));
        assert(responseString.contains("grad school"));
        assert(responseString.contains("2025-05-01T10:00:00"));
    }
}
