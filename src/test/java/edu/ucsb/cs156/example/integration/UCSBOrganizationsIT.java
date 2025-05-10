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

import edu.ucsb.cs156.example.entities.UCSBOrganization;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationRepository;
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
    This is a Integration Test class for the UCSBOrganizations controller.
*/

public class UCSBOrganizationsIT {
    @Autowired
    UCSBOrganizationRepository ucsbOrganizationRepository;

    @Autowired
    public MockMvc mockMvc;

    @WithMockUser(roles = { "USER" })
    @Test
    public void get_ucsborganizations() throws Exception {
        ucsbOrganizationRepository.deleteAll();

        // arrange
        UCSBOrganization ucsbOrganization = UCSBOrganization.builder()
            .orgCode("UCSB")
            .orgTranslationShort("UCSB")
            .orgTranslation("University of California, Santa Barbara")
            .build();
                        
        ucsbOrganizationRepository.save(ucsbOrganization);

        mockMvc.perform(get("/api/ucsborganizations/all"))
            .andExpect(status().isOk())
            .andExpect(content().string(containsString("UCSB")))
            .andExpect(content().string(containsString("University of California, Santa Barbara")));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void post_ucsborganizations() throws Exception {
        MvcResult response = mockMvc.perform(
            post("/api/ucsborganizations/post")
                .param("orgCode", "UCSB")
                .param("orgTranslationShort", "UCSB")
                .param("orgTranslation", "University of California, Santa Barbara")
                .with(csrf()))
            .andExpect(status().isOk())
            .andExpect(content().string(containsString("UCSB")))
            .andExpect(content().string(containsString("University of California, Santa Barbara")))
            .andReturn();

        String responseString = response.getResponse().getContentAsString();

        assert(responseString.contains("UCSB"));
        assert(responseString.contains("University of California, Santa Barbara"));
    }
}
