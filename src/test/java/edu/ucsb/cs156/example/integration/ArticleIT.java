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
public class ArticleIT {
        // @Autowired
        // public CurrentUserService currentUserService;

        // @Autowired
        // public GrantedAuthoritiesService grantedAuthoritiesService;

        @Autowired
        ArticlesRepository articleRepository;

        @Autowired
        public MockMvc mockMvc;

        // @Autowired
        // public ObjectMapper mapper;

        // @MockBean
        // UserRepository userRepository;

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                Articles article1 = Articles.builder()
                    .title("Article 1")
                    .url("https://ucsb-cs156.github.io/s25/lab/team01.html")
                    .explanation("dining hall menu")
                    .email("student1@ucsb.edu")
                    .dateAdded(ldt1)
                    .build();

                articleRepository.save(article1);


                // act
                // MvcResult response = mockMvc.perform(get("/api/articles?id=1"))
                //                 .andExpect(status().isOk()).andReturn();

                // // assert
                
                // String expectedJson = mapper.writeValueAsString(article1);
                // String responseString = response.getResponse().getContentAsString();
                // assertEquals(expectedJson, responseString);

                mockMvc.perform(get("/api/articles/all"))
                        .andExpect(status().isOk())
                        .andExpect(content().string(containsString("Article 1")))
                        .andExpect(content().string(containsString("https://ucsb-cs156.github.io/s25/lab/team01.html")))
                        .andExpect(content().string(containsString("dining hall menu")))
                        .andExpect(content().string(containsString("student1@ucsb.edu")))
                        .andExpect(content().string(containsString("22022-01-03T00:00:00")));
    }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_article() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                // Articles article1 = Articles.builder()
                //     .id(1L)
                //     .title("Article 1")
                //     .url("https://ucsb-cs156.github.io/s25/lab/team01.html")
                //     .explanation("dining hall menu")
                //     .email("student1@ucsb.edu")
                //     .dateAdded(ldt1)
                //     .build();
                

                MvcResult response = mockMvc.perform(
                        post("/api/articles/post")
                                .param("title", "Article 1")
                                .param("url", "https://ucsb-cs156.github.io/s25/lab/team01.html")
                                .param("explanation", "dining hall menu")
                                .param("email", "student1@ucsb.edu")
                                .param("dateAdded", "2022-01-03T00:00:00")
                                .with(csrf()))
                        .andExpect(status().isOk())
                        .andExpect(content().string(containsString("Article 1")))
                        .andExpect(content().string(containsString("https://ucsb-cs156.github.io/s25/lab/team01.html")))
                        .andExpect(content().string(containsString("dining hall menu")))
                        .andExpect(content().string(containsString("student1@ucsb.edu")))
                        .andExpect(content().string(containsString("2022-01-03T00:00:00")))
                        .andReturn();

        String responseString = response.getResponse().getContentAsString();

        assert(responseString.contains("Article 1"));
        assert(responseString.contains("https://ucsb-cs156.github.io/s25/lab/team01.html"));
        assert(responseString.contains("dining hall menu"));
        assert(responseString.contains("student1@ucsb.edu"));
        assert(responseString.contains("2022-01-03T00:00:00"));
                

                // act
                // MvcResult response = mockMvc.perform(
                //                 post("/api/articles/post?title=Article 1&url=https://ucsb-cs156.github.io/s25/lab/team01.html&explanation=dining hall menu&email=student1@ucsb.edu&dateAdded=2022-01-03T00:00:00")
                //                                 .with(csrf()))
                //                 .andExpect(status().isOk()).andReturn();

                // // assert
                // article1.setId(1L);
                // String expectedJson = mapper.writeValueAsString(article1);
                // String responseString = response.getResponse().getContentAsString();
                // assertEquals(expectedJson, responseString);
        }
}
