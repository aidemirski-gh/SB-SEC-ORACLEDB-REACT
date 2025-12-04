package com.dev.crm.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RolePrivilegesUpdateDTO {

    @NotNull(message = "{validation.role.privileges.required}")
    private Set<Long> privilegeIds;
}
