package com.dev.crm.controller;

import com.dev.crm.dto.PrivilegeCreateDTO;
import com.dev.crm.dto.PrivilegeDTO;
import com.dev.crm.dto.PrivilegeUpdateDTO;
import com.dev.crm.service.PrivilegeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/privileges")
@RequiredArgsConstructor
public class PrivilegeController {

    private final PrivilegeService privilegeService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('SYSTEM_ADMIN', 'READ_ROLES', 'MANAGE_ROLE_PRIVILEGES')")
    public ResponseEntity<List<PrivilegeDTO>> getAllPrivileges() {
        return ResponseEntity.ok(privilegeService.getAllPrivileges());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SYSTEM_ADMIN', 'READ_ROLES', 'MANAGE_ROLE_PRIVILEGES')")
    public ResponseEntity<PrivilegeDTO> getPrivilegeById(@PathVariable Long id) {
        return ResponseEntity.ok(privilegeService.getPrivilegeById(id));
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("hasAnyAuthority('SYSTEM_ADMIN', 'READ_ROLES', 'MANAGE_ROLE_PRIVILEGES')")
    public ResponseEntity<List<PrivilegeDTO>> getPrivilegesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(privilegeService.getPrivilegesByCategory(category));
    }

    @GetMapping("/categories")
    @PreAuthorize("hasAnyAuthority('SYSTEM_ADMIN', 'READ_ROLES', 'MANAGE_ROLE_PRIVILEGES')")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(privilegeService.getAllCategories());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    public ResponseEntity<PrivilegeDTO> createPrivilege(@Valid @RequestBody PrivilegeCreateDTO createDTO) {
        return ResponseEntity.ok(privilegeService.createPrivilege(createDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    public ResponseEntity<PrivilegeDTO> updatePrivilege(
            @PathVariable Long id,
            @Valid @RequestBody PrivilegeUpdateDTO updateDTO) {
        return ResponseEntity.ok(privilegeService.updatePrivilege(id, updateDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('SYSTEM_ADMIN')")
    public ResponseEntity<Void> deletePrivilege(@PathVariable Long id) {
        privilegeService.deletePrivilege(id);
        return ResponseEntity.noContent().build();
    }
}
