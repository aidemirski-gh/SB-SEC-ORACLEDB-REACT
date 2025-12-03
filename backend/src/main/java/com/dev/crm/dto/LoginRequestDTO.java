package com.dev.crm.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDTO {

    @NotBlank(message = "{validation.user.username.required}")
    private String username;

    @NotBlank(message = "{validation.user.password.required}")
    private String password;
}
