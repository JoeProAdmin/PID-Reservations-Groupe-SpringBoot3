package be.icc.pid.reservations.admin.dto;

import java.time.LocalDateTime;

public class AdminSpectacleDTO {

    private Long id;
    private String title;
    private String description;
    private LocalDateTime date;
    private Double price;

    // GETTERS
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public LocalDateTime getDate() { return date; }
    public Double getPrice() { return price; }

    // SETTERS
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public void setPrice(Double price) { this.price = price; }
}