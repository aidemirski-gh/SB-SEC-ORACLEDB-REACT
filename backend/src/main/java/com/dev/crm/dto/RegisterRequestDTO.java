package com.dev.crm.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {

    @NotBlank(message = "{validation.user.username.required}")
    @Size(min = 3, max = 50, message = "{validation.user.username.size}")
    private String username;

    @NotBlank(message = "{validation.user.email.required}")
    @Email(message = "{validation.user.email.valid}")
    private String email;

    @NotBlank(message = "{validation.user.password.required}")
    @Size(min = 6, message = "{validation.user.password.size}")
    private String password;

    private String firstName;

    private String lastName;

    @Pattern(regexp = "en|bg", message = "{validation.language.invalid}")
    private String languagePreference = "en";
}
