package com.dev.crm.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrivilegeUpdateDTO {

    @Size(max = 255, message = "{validation.privilege.description.size}")
    private String description;

    @Size(max = 50, message = "{validation.privilege.category.size}")
    private String category;
}
