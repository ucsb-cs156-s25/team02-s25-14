package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.UCSBOrganization;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
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

/**
 * This is a REST controller for UCSB Organizations
 */

@Tag(name = "UCSB Organizations")
@RequestMapping("/api/ucsborganizations")
@RestController
public class UCSBOrganizationController extends ApiController {

    @Autowired
    UCSBOrganizationRepository ucsbOrganizationRepository;

    /**
     * This method returns a list of all UCSB Organizations.
     * @return a list of all UCSB Organizations
     */
    @Operation(summary = "List all UCSB Organizations")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<UCSBOrganization> allUCSBOrganizations() {
        Iterable<UCSBOrganization> ucsbOrganizations = ucsbOrganizationRepository.findAll();
        return ucsbOrganizations;
    }

    /**
     * Get a single UCSB Organization
     * 
     * @param orgCode the orgCode of the UCSB Organization to get
     * @return the UCSB Organization
     */
    @Operation(summary = "Get a single UCSB Organization")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public UCSBOrganization getById(
            @Parameter(name = "orgCode") @RequestParam String orgCode) {
        UCSBOrganization ucsbOrganization = ucsbOrganizationRepository.findById(orgCode)
                .orElseThrow(() -> new EntityNotFoundException(UCSBOrganization.class, orgCode));

        return ucsbOrganization;
    }

    /**
     * This method creates a new UCSB Organization. Accessible only to users with the role "ROLE_ADMIN".
     * @param orgCode orgCode of the UCSB Organization
     * @param orgTranslationShort orgTranslationShort of the UCSB Organization
     * @param orgTranslation orgTranslation of the UCSB Organization
     * @return the save UCSB Organization (with it's id field set by the database)
     */
    @Operation(summary = "Create a new UCSB Organization")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public UCSBOrganization postUCSBOrganization(
            @Parameter(name = "orgCode") @RequestParam String orgCode,
            @Parameter(name = "orgTranslationShort") @RequestParam String orgTranslationShort,
            @Parameter(name = "orgTranslation") @RequestParam String orgTranslation) {
        UCSBOrganization ucsbOrganization = new UCSBOrganization();

        ucsbOrganization.setOrgCode(orgCode);
        ucsbOrganization.setOrgTranslationShort(orgTranslationShort);
        ucsbOrganization.setOrgTranslation(orgTranslation);
        
        UCSBOrganization savedUCSBOrganization = ucsbOrganizationRepository.save(ucsbOrganization);
        return savedUCSBOrganization;
    }

    /**
     * Deletes a UCSB Organization. Accessible only to users with the role "ROLE_ADMIN".
     * @param orgCode orgCode of the UCSB Organization to delete
     * @return a message indicating that the UCSB Organization was deleted
     */
    @Operation(summary = "Delete a UCSB Organization")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteUCSBOrganization(
            @Parameter(name = "orgCode") @RequestParam String orgCode) {
        UCSBOrganization ucsbOrganization = ucsbOrganizationRepository.findById(orgCode)
                .orElseThrow(() -> new EntityNotFoundException(UCSBOrganization.class, orgCode));

        ucsbOrganizationRepository.delete(ucsbOrganization);
        return genericMessage("UCSBOrganization with id %s deleted".formatted(orgCode));
    }

    /**
     * Update a single UCSB Organization. Accessible only to users with the role "ROLE_ADMIN".
     * @param orgCode orgCode of the UCSB Organization to update
     * @param incoming the new UCSB Organization contents
     * @return the updated UCSB Organization object
     */
    @Operation(summary = "Update a single UCSB Organization")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public UCSBOrganization updateUCSBOrganization(
            @Parameter(name = "orgCode") @RequestParam String orgCode,
            @RequestBody @Valid UCSBOrganization incoming) {

        UCSBOrganization ucsbOrganization = ucsbOrganizationRepository.findById(orgCode)
                .orElseThrow(() -> new EntityNotFoundException(UCSBOrganization.class, orgCode));

        incoming.setOrgCode(orgCode);
        ucsbOrganizationRepository.save(incoming);

        return incoming;
    }
}