package edu.ucsb.cs156.example.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 
 * This is a JPA entity that represents a UCSBDiningCommonsMenuItem
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity      // you can optionally name the entity here…
@Table(name = "ucsbdiningcommonsmenuitems")  // …but this is the table name in Postgres/H2
public class UCSBDiningCommonsMenuItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String diningCommonsCode;
  private String name;
  private String station;
}
