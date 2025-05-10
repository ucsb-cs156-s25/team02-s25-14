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

import edu.ucsb.cs156.example.entities.Articles;
import edu.ucsb.cs156.example.repositories.ArticlesRepository;
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
    This is a Integration Test class for the Articles controller.
*/

public class ArticlesIT {
    @Autowired
    ArticlesRepository articlesRepository;

    @Autowired
    public MockMvc mockMvc;

    @WithMockUser(roles = { "USER" })
    @Test
    public void get_articles() throws Exception {
        articlesRepository.deleteAll();

        // arrange
        Articles articles = Articles.builder()
            .title("test title")
            .url("www.test.com")
            .explanation("testing")
            .email("test@ucsb.edu")
            .dateAdded(LocalDateTime.parse("2025-05-01T10:00:00"))
            .build();

        articlesRepository.save(articles);

        mockMvc.perform(get("/api/articles/all"))
            .andExpect(status().isOk())
            .andExpect(content().string(containsString("test title")))
            .andExpect(content().string(containsString("www.test.com")))
            .andExpect(content().string(containsString("testing")))
            .andExpect(content().string(containsString("test@ucsb.edu")))
            .andExpect(content().string(containsString("2025-05-01T10:00:00")));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void post_articles() throws Exception {
        MvcResult response = mockMvc.perform(
            post("/api/articles/post")
                .param("title", "test title")
                .param("url", "www.test.com")
                .param("explanation", "testing")
                .param("email", "test@ucsb.edu")
                .param("dateAdded", "2025-05-01T10:00:00")
                .with(csrf()))
            .andExpect(status().isOk())
            .andExpect(content().string(containsString("test title")))
            .andExpect(content().string(containsString("www.test.com")))
            .andExpect(content().string(containsString("testing")))
            .andExpect(content().string(containsString("test@ucsb.edu")))
            .andExpect(content().string(containsString("2025-05-01T10:00:00")))
            .andReturn();

        String responseString = response.getResponse().getContentAsString();

        assert(responseString.contains("test title"));
        assert(responseString.contains("www.test.com"));
        assert(responseString.contains("testing"));
        assert(responseString.contains("test@ucsb.edu"));
        assert(responseString.contains("2025-05-01T10:00:00"));
    }
}
