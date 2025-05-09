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

import edu.ucsb.cs156.example.entities.MenuItemReview;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;
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
public class MenuItemReviewIT {
        @Autowired
        public CurrentUserService currentUserService;

        @Autowired
        public GrantedAuthoritiesService grantedAuthoritiesService;

        @Autowired
        MenuItemReviewRepository menuItemReviewRepository;

        @Autowired
        public MockMvc mockMvc;

        @Autowired
        public ObjectMapper mapper;

        @MockBean
        UserRepository userRepository;

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
                // arrange

                MenuItemReview menuItemReview = MenuItemReview.builder()
                                .itemId(30)
                                .reviewerEmail("test@gmail.com")
                                .stars(4)
                                .dateReviewed(LocalDateTime.parse("2025-05-01T10:00:00"))
                                .comments("that was pretty fire")
                                .build();
                                
                menuItemReviewRepository.save(menuItemReview);

                // act
                MvcResult response = mockMvc.perform(get("/api/MenuItemReview?id=1"))
                                .andExpect(status().isOk()).andReturn();

                // assert
                String expectedJson = mapper.writeValueAsString(menuItemReview);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_restaurant() throws Exception {
                // arrange

                MenuItemReview menuItemReview1 = MenuItemReview.builder()
                                .id(1L)
                                .itemId(40)
                                .reviewerEmail("test1@gmail.com")
                                .stars(3)
                                .dateReviewed(LocalDateTime.parse("2025-05-01T10:00:00"))
                                .comments("that was fire")
                                .build();

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/MenuItemReview/post?itemId=40&reviewerEmail=test1@gmail.com&stars=3&dateReviewed=2025-05-01T10:00:00&comments=that was fire")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                String expectedJson = mapper.writeValueAsString(menuItemReview1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }
}
