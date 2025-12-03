package com.dev.crm.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerCreateDTO {

    @NotBlank(message = "{validation.customer.firstName.required}")
    private String firstName;

    @NotBlank(message = "{validation.customer.lastName.required}")
    private String lastName;

    @Email(message = "{validation.customer.email.valid}")
    @NotBlank(message = "{validation.customer.email.required}")
    private String email;

    private String phoneNumber;

    private String companyName;

    private String notes;
}
