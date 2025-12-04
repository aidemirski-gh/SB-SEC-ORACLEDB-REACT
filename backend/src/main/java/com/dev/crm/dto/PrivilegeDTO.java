package com.dev.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrivilegeDTO {
    private Long id;
    private String name;
    private String description;
    private String category;
    private long roleCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
