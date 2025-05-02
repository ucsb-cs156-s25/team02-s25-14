package edu.ucsb.cs156.example.repositories;

import edu.ucsb.cs156.example.entities.UCSBOrganization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/*
Repository for UCSB Organization entities.
*/

@Repository
public interface UCSBOrganizationRepository extends JpaRepository<UCSBOrganization, String> {
}
