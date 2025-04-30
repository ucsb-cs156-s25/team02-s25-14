package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import java.time.LocalDateTime;



/**
 * This is a REST controller for HelpRequest
 */


@Tag(name = "HelpRequest")
@RequestMapping("/api/helprequests")
@RestController
@Slf4j

public class HelpRequestController extends ApiController {  
    
    @Autowired
    HelpRequestRepository helpRequestRepository;

    /**
     * List all Help Requests
     * 
     * @return an iterable of Help Requests
     */
    @Operation(summary= "List all help requests")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<HelpRequest> allHelpRequest() {
        Iterable<HelpRequest> helprequests = helpRequestRepository.findAll();
        return helprequests;

    }




     /**
     * Create a new help request
     * 
     * @param requesterEmail  requester email
     * @param teamId          team id
     * @param tableOrBreakoutRoom table or breakout room
     * @param requestTime request time
     * @param explanation explanation
     * @param solved solved
     * @return the saved ucsbdate
     */
    @Operation(summary= "Create a new help request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public HelpRequest postHelpRequest(
            @Parameter(name="requesterEmail") @RequestParam String requesterEmail,
            @Parameter(name="teamId") @RequestParam String teamId,
            @Parameter(name="tableOrBreakoutRoom") @RequestParam String tableOrBreakoutRoom,
            @Parameter(name="explanation") @RequestParam String explanation,
            @Parameter(name="solved") @RequestParam boolean solved,
            @Parameter(name="requestTime", description="date (in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601)") @RequestParam("requestTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime requestTime)

            throws JsonProcessingException {

        // For an explanation of @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        // See: https://www.baeldung.com/spring-date-parameters

        log.info("requestTime={}", requestTime);

        HelpRequest helprequest = new HelpRequest();
        helprequest.setRequesterEmail(requesterEmail);
        helprequest.setTeamId(teamId);
        helprequest.setTableOrBreakoutRoom(tableOrBreakoutRoom);
        helprequest.setRequestTime(requestTime);
        helprequest.setSolved(solved);
        helprequest.setExplanation(explanation);

        HelpRequest savedHelpRequest = helpRequestRepository.save(helprequest);

        return savedHelpRequest;
    }
    /**
     * Get a single help request by id
     * 
     * @param id the id of the help request
     * @return a HelpRequest
     */
    @Operation(summary= "Get a help request")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public HelpRequest getById(
            @Parameter(name="id") @RequestParam Long id) {
        HelpRequest helpRequest = helpRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(HelpRequest.class, id));

        return helpRequest;
    }



    /**
     * Update a single Help Request
     * 
     * @param id       id of the help request to update
     * @param incoming the new help request
     * @return the updated help request object
     */
    @Operation(summary= "Update a single help request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public HelpRequest updateHelpRequest(
            @Parameter(name="id") @RequestParam Long id,
            @RequestBody @Valid HelpRequest incoming) {

        HelpRequest helpRequest = helpRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(HelpRequest.class, id));

        helpRequest.setRequesterEmail(incoming.getRequesterEmail());
        helpRequest.setTeamId(incoming.getTeamId());
        helpRequest.setTableOrBreakoutRoom(incoming.getTableOrBreakoutRoom());
        helpRequest.setRequestTime(incoming.getRequestTime());
        helpRequest.setSolved(incoming.getSolved());
        helpRequest.setExplanation(incoming.getExplanation());

        helpRequestRepository.save(helpRequest);

        return helpRequest;
    }



    
    /**
     * Delete a Help Request
     * 
     * @param id the id of the help request to delete
     * @return a message indicating the help request was deleted
     */
    @Operation(summary= "Delete a HelpRequest")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteHelpRequest(
            @Parameter(name="id") @RequestParam Long id) {
        HelpRequest helpRequest = helpRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(HelpRequest.class, id));

        helpRequestRepository.delete(helpRequest);
        return genericMessage("HelpRequest with id %s deleted".formatted(id));
    }





}