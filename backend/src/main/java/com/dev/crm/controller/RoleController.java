package com.dev.crm.controller;

import com.dev.crm.dto.PrivilegeDTO;
import com.dev.crm.dto.RoleCreateDTO;
import com.dev.crm.dto.RoleDTO;
import com.dev.crm.dto.RolePrivilegesUpdateDTO;
import com.dev.crm.dto.RoleUpdateDTO;
import com.dev.crm.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RoleDTO>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoleDTO> getRoleById(@PathVariable Long id) {
        return ResponseEntity.ok(roleService.getRoleById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoleDTO> createRole(@Valid @RequestBody RoleCreateDTO createDTO) {
        return ResponseEntity.ok(roleService.createRole(createDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoleDTO> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody RoleUpdateDTO updateDTO) {
        return ResponseEntity.ok(roleService.updateRole(id, updateDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }

    // Privilege management endpoints

    @GetMapping("/{id}/privileges")
    @PreAuthorize("hasAnyAuthority('SYSTEM_ADMIN', 'READ_ROLES', 'MANAGE_ROLE_PRIVILEGES')")
    public ResponseEntity<Set<PrivilegeDTO>> getRolePrivileges(@PathVariable Long id) {
        return ResponseEntity.ok(roleService.getRolePrivileges(id));
    }

    @PutMapping("/{id}/privileges")
    @PreAuthorize("hasAnyAuthority('SYSTEM_ADMIN', 'MANAGE_ROLE_PRIVILEGES')")
    public ResponseEntity<RoleDTO> updateRolePrivileges(
            @PathVariable Long id,
            @Valid @RequestBody RolePrivilegesUpdateDTO privilegesDTO) {
        return ResponseEntity.ok(roleService.updateRolePrivileges(id, privilegesDTO));
    }

    @PostMapping("/{roleId}/privileges/{privilegeId}")
    @PreAuthorize("hasAnyAuthority('SYSTEM_ADMIN', 'MANAGE_ROLE_PRIVILEGES')")
    public ResponseEntity<RoleDTO> addPrivilegeToRole(
            @PathVariable Long roleId,
            @PathVariable Long privilegeId) {
        return ResponseEntity.ok(roleService.addPrivilegeToRole(roleId, privilegeId));
    }

    @DeleteMapping("/{roleId}/privileges/{privilegeId}")
    @PreAuthorize("hasAnyAuthority('SYSTEM_ADMIN', 'MANAGE_ROLE_PRIVILEGES')")
    public ResponseEntity<RoleDTO> removePrivilegeFromRole(
            @PathVariable Long roleId,
            @PathVariable Long privilegeId) {
        return ResponseEntity.ok(roleService.removePrivilegeFromRole(roleId, privilegeId));
    }
}
