package com.dev.crm.dto;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferencesUpdateDTO {

    @Pattern(regexp = "en|bg", message = "{validation.language.invalid}")
    private String languagePreference;
}
