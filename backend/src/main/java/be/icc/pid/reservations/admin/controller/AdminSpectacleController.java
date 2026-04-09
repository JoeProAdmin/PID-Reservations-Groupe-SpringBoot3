package be.icc.pid.reservations.admin.controller;

import be.icc.pid.reservations.admin.dto.AdminSpectacleDTO;
import be.icc.pid.reservations.admin.service.AdminSpectacleService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/spectacles")
public class AdminSpectacleController {

    private final AdminSpectacleService service;

    public AdminSpectacleController(AdminSpectacleService service) {
        this.service = service;
    }

    @GetMapping
    public String list(Model model) {
        model.addAttribute("spectacles", service.getAll());
        model.addAttribute("title", "Administration des spectacles");
        return "admin/spectacles/index";
    }

    @GetMapping("/create")
    public String createForm(Model model) {
        model.addAttribute("spectacle", new AdminSpectacleDTO());
        return "admin/spectacles/create";
    }

    @PostMapping
    public String create(@ModelAttribute AdminSpectacleDTO dto) {
        service.create(dto);
        return "redirect:/admin/spectacles";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "redirect:/admin/spectacles";
    }

    // ========================
    // EDIT FORM
    // ========================
    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable Long id, Model model) {
        model.addAttribute("spectacle", service.getById(id));
        return "admin/spectacles/edit";
    }

    // ========================
    // UPDATE ACTION
    // ========================
    @PostMapping("/update/{id}")
    public String update(@PathVariable Long id,
                         @ModelAttribute AdminSpectacleDTO dto) {

        service.update(id, dto);
        return "redirect:/admin/spectacles";
    }
}