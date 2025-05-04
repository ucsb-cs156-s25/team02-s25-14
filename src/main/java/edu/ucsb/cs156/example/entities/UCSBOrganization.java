package edu.ucsb.cs156.example.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class UCSBOrganization {
    @Id
    private String orgCode;
    private String orgTranslationShort;
    private String orgTranslation;
    private boolean inactive;
} 