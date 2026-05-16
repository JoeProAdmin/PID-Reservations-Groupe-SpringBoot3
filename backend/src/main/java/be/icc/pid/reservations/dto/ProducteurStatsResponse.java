package be.icc.pid.reservations.dto;

import java.util.List;

public class ProducteurStatsResponse {

    private int totalSpectacles;
    private int totalRepresentations;
    private int totalReservations;
    private int totalSeatsSold;
    private double totalRevenue;
    private Double averageRating;
    private int totalComments;

    private List<SpectacleStats> spectacles;

    public ProducteurStatsResponse() {
    }

    public static class SpectacleStats {
        private Long id;
        private String title;
        private String location;
        private String date;
        private int representationsCount;
        private int totalCapacity;
        private int seatsSold;
        private double fillRate;
        private int reservationsCount;
        private double revenue;
        private Double averageRating;
        private int commentsCount;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public int getRepresentationsCount() { return representationsCount; }
        public void setRepresentationsCount(int v) { this.representationsCount = v; }
        public int getTotalCapacity() { return totalCapacity; }
        public void setTotalCapacity(int v) { this.totalCapacity = v; }
        public int getSeatsSold() { return seatsSold; }
        public void setSeatsSold(int v) { this.seatsSold = v; }
        public double getFillRate() { return fillRate; }
        public void setFillRate(double v) { this.fillRate = v; }
        public int getReservationsCount() { return reservationsCount; }
        public void setReservationsCount(int v) { this.reservationsCount = v; }
        public double getRevenue() { return revenue; }
        public void setRevenue(double v) { this.revenue = v; }
        public Double getAverageRating() { return averageRating; }
        public void setAverageRating(Double v) { this.averageRating = v; }
        public int getCommentsCount() { return commentsCount; }
        public void setCommentsCount(int v) { this.commentsCount = v; }
    }

    public int getTotalSpectacles() { return totalSpectacles; }
    public void setTotalSpectacles(int v) { this.totalSpectacles = v; }
    public int getTotalRepresentations() { return totalRepresentations; }
    public void setTotalRepresentations(int v) { this.totalRepresentations = v; }
    public int getTotalReservations() { return totalReservations; }
    public void setTotalReservations(int v) { this.totalReservations = v; }
    public int getTotalSeatsSold() { return totalSeatsSold; }
    public void setTotalSeatsSold(int v) { this.totalSeatsSold = v; }
    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double v) { this.totalRevenue = v; }
    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double v) { this.averageRating = v; }
    public int getTotalComments() { return totalComments; }
    public void setTotalComments(int v) { this.totalComments = v; }
    public List<SpectacleStats> getSpectacles() { return spectacles; }
    public void setSpectacles(List<SpectacleStats> v) { this.spectacles = v; }
}
