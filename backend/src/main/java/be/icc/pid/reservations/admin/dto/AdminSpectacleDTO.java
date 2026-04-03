package be.icc.pid.reservations.admin.dto;

import lombok.Data;

@Data
public class AdminSpectacleDTO {

    private Long id;
    private String title;
    private String description;
    private Double price;
    private Boolean bookable;
}