package com.dev.crm.repository;

import com.dev.crm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    // Role-related queries (many-to-many)
    @Query("SELECT DISTINCT u FROM User u JOIN u.roles r WHERE r.id = :roleId")
    List<User> findByRoleId(@Param("roleId") Long roleId);

    @Query("SELECT DISTINCT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
    List<User> findByRoleName(@Param("roleName") String roleName);

    @Query("SELECT COUNT(DISTINCT u) FROM User u JOIN u.roles r WHERE r.id = :roleId")
    long countByRoleId(@Param("roleId") Long roleId);

    @Query("SELECT DISTINCT u FROM User u JOIN u.roles r WHERE r.id IN :roleIds")
    List<User> findByRoleIds(@Param("roleIds") List<Long> roleIds);

    @Query("SELECT DISTINCT u FROM User u JOIN u.roles r JOIN r.privileges p WHERE p.name = :privilegeName")
    List<User> findByPrivilege(@Param("privilegeName") String privilegeName);
}
