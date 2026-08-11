package vn.edu.crs.courseservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import vn.edu.crs.courseservice.dto.CourseDTO;
import vn.edu.crs.courseservice.service.CourseService;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    // Lab 3: tim kiem + phan trang + sap xep
    @GetMapping
    public Page<CourseDTO> search(
            @RequestParam(required = false) String keyword,
            Pageable pageable) {

        return courseService.search(keyword, pageable);
    }

    // Lay mon hoc theo id
    @GetMapping("/{id}")
    public CourseDTO getById(@PathVariable Long id) {
        return courseService.getById(id);
    }

    // Tao mon hoc moi
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CourseDTO create(
            @Valid @RequestBody CourseDTO dto) {

        return courseService.create(dto);
    }

    // Cap nhat mon hoc
    @PutMapping("/{id}")
    public CourseDTO update(
            @PathVariable Long id,
            @Valid @RequestBody CourseDTO dto) {

        return courseService.update(id, dto);
    }

    // Xoa mon hoc
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {

        courseService.delete(id);
    }
}