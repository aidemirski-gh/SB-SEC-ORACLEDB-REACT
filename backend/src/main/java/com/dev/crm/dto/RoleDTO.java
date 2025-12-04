package com.dev.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleDTO {
    private Long id;
    private String name;
    private String description;
    private boolean systemRole;
    private long userCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
