package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.UCSBDiningCommonsMenuItem;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemRepository;

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
 * This is a REST controller for UCSBDates
 */

@Tag(name = "UCSBDiningCommonsMenuItems")
@RequestMapping("/api/ucsbdiningcommonsmenuitem")
@RestController
@Slf4j
public class UCSBDiningCommonsMenuItemController extends ApiController {

    @Autowired
    UCSBDiningCommonsMenuItemRepository ucsbDiningCommonsMenuItemRepository;

    /**
     * List all UCSB dates
     * 
     * @return an iterable of UCSBDate
     */
    @Operation(summary= "List all ucsbdiningcommons menu items")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<UCSBDiningCommonsMenuItem> allUCSBDiningCommonsMenuItems() {
        Iterable<UCSBDiningCommonsMenuItem> menuItems = ucsbDiningCommonsMenuItemRepository.findAll();
        return menuItems;
    }

     /**
     * Get a single UCSBDiningCommonsMenuItem by id
     * 
     * @param id the id of the date
     * @return a UCSBDiningCommonsMenuItem
     */
    @Operation(summary= "Get a single UCSBDiningCommonsMenuItem")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public UCSBDiningCommonsMenuItem getById(
            @Parameter(name="id") @RequestParam Long id) {
        UCSBDiningCommonsMenuItem ucsbDiningCommonsMenuItem = ucsbDiningCommonsMenuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));

        return ucsbDiningCommonsMenuItem;
    }

    /**
     * Create a new date
     * 
     * @param diningCommonsCode  the dining commons code
     * @param name          the name of the menu item
     * @param station the station
     * @return the saved ucsbdate
     */
    @Operation(summary= "Create a new UCSBDiningCommonsMenuItem")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public UCSBDiningCommonsMenuItem postUCSBDiningCommonsMenuItem(
            @Parameter(name="diningCommonsCode") @RequestParam String diningCommonsCode,
            @Parameter(name="name") @RequestParam String name,
            @Parameter(name="station") @RequestParam String station) {

        UCSBDiningCommonsMenuItem ucsbDiningCommonsMenuItem = new UCSBDiningCommonsMenuItem();

        ucsbDiningCommonsMenuItem.setDiningCommonsCode(diningCommonsCode);
        ucsbDiningCommonsMenuItem.setName(name);
        ucsbDiningCommonsMenuItem.setStation(station);
        
        ucsbDiningCommonsMenuItemRepository.save(ucsbDiningCommonsMenuItem);

        return ucsbDiningCommonsMenuItem;
    }

    /**
     * Update a single date
     * 
     * @param id       id of the date to update
     * @param incoming the new ucsbdiningcommonsmenuitem
     * @return the updated ucsbdiningcommonsmenuitem object
     */
    @Operation(summary= "Update a single ucsbdiningcommonsmenuitem")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public UCSBDiningCommonsMenuItem updateUCSBDiningCommonsMenuItem(
            @Parameter(name="id") @RequestParam Long id,
            @RequestBody @Valid UCSBDiningCommonsMenuItem incoming) {

        UCSBDiningCommonsMenuItem ucsbDiningCommonsMenuItem = ucsbDiningCommonsMenuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));

        ucsbDiningCommonsMenuItem.setDiningCommonsCode(incoming.getDiningCommonsCode());
        ucsbDiningCommonsMenuItem.setName(incoming.getName());
        ucsbDiningCommonsMenuItem.setStation(incoming.getStation());

        ucsbDiningCommonsMenuItemRepository.save(ucsbDiningCommonsMenuItem);

        return ucsbDiningCommonsMenuItem;
    }

     /**
     * Delete a UCSBDiningCommonsMenuItem
     * 
     * @param id the id of the date to delete
     * @return a message indicating the date was deleted
     */
    @Operation(summary= "Delete a UCSBDiningCommonsMenuItem")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteUCSBDiningCommonsMenuItem(
            @Parameter(name="id") @RequestParam Long id) {
        UCSBDiningCommonsMenuItem ucsbDiningCommonsMenuItem = ucsbDiningCommonsMenuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));

        ucsbDiningCommonsMenuItemRepository.delete(ucsbDiningCommonsMenuItem);
        return genericMessage("UCSBDiningCommonsMenuItem with id %s deleted".formatted(id));
    }
}
