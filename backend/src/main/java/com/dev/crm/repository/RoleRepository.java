package com.dev.crm.repository;

import com.dev.crm.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String name);

    boolean existsByName(String name);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.role.id = :roleId")
    boolean isRoleAssignedToUsers(Long roleId);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role.id = :roleId")
    long countUsersByRole(Long roleId);
}
