package edu.ucsb.cs156.example.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Date;
/**
 * This is a JPA entity that represents a UCSB Recommendation Requests,
 *  i.e. an entry that comes from the UCSB API for recommendation request data.
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "recommendationrequests")
public class RecommendationRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;
  private String requesterEmail;
  private String professorEmail;
  private String explanation;
  private LocalDateTime dateRequested;
  private LocalDateTime dateNeeded;
  private Boolean done;
}