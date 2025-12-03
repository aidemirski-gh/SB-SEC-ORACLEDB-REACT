package com.dev.crm.dto;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerUpdateDTO {

    private String firstName;

    private String lastName;

    @Email(message = "{validation.customer.email.valid}")
    private String email;

    private String phoneNumber;

    private String companyName;

    private String notes;
}
