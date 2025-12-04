package com.dev.crm.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "privileges")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Privilege {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "{validation.privilege.name.required}")
    @Size(min = 3, max = 100, message = "{validation.privilege.name.size}")
    @Pattern(regexp = "^[A-Z_]+$", message = "{validation.privilege.name.pattern}")
    @Column(unique = true, nullable = false, length = 100)
    private String name;

    @Size(max = 255, message = "{validation.privilege.description.size}")
    @Column(length = 255)
    private String description;

    @Size(max = 50, message = "{validation.privilege.category.size}")
    @Column(length = 50)
    private String category;

    @ManyToMany(mappedBy = "privileges")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Role> roles = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
