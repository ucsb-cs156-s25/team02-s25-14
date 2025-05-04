package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {
    
    @Test
    public void admin_can_create_recommendation_request() {
        setupUser(true);

        page.getByText("Recommendation Requests").click();
        page.waitForURL("**/recommendationrequest");

        page.waitForSelector("text=Create RecommendationRequest");
        page.getByText("Create RecommendationRequest").click();
        page.waitForURL("**/recommendationrequest/create");

        page.getByTestId("RecommendationRequestForm-requesterEmail").fill("test@ucsb.edu");
        page.getByTestId("RecommendationRequestForm-professorEmail").fill("prof@ucsb.edu");
        page.getByTestId("RecommendationRequestForm-explanation").fill("end to end testing");
        page.getByTestId("RecommendationRequestForm-dateRequested").fill("2025-05-01T10:00");
        page.getByTestId("RecommendationRequestForm-dateNeeded").fill("2025-05-13T10:00");
        page.getByTestId("RecommendationRequestForm-done").click();

        page.getByTestId("RecommendationRequestForm-submit").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation"))
            .hasText("end to end testing");
    }
}

