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
public class HelpRequestWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_help_request() throws Exception {
        setupUser(true);

        page.getByText("Help Request").click();

        page.getByText("Create Help Request").click();
        assertThat(page.getByText("Create New Help Request")).isVisible();
       page.getByTestId("HelpRequestForm-requesterEmail").fill("test@example.com");
        page.getByTestId("HelpRequestForm-teamId").fill("team123");
        page.getByTestId("HelpRequestForm-tableOrBreakoutRoom").fill("Table 5");
        page.getByTestId("HelpRequestForm-requestTime").fill("2023-10-20T12:34");
        page.getByTestId("HelpRequestForm-explanation").fill("Need help with setup");
        page.getByTestId("HelpRequestForm-submit").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-explanation"))
                .hasText("Need help with setup");

        page.getByTestId("HelpRequestTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Help Request")).isVisible();
        page.getByTestId("HelpRequestForm-explanation").fill("Updated explanation");
        page.getByTestId("HelpRequestForm-submit").click();
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-explanation"))
                .hasText("Updated explanation");


        page.getByTestId("HelpRequestTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_restaurant() throws Exception {
        setupUser(false);

        page.getByText("Help Request").click();

        assertThat(page.getByText("Create Help Request")).not().isVisible();
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-name")).not().isVisible();
    }
}