package com.dev.crm.repository;

import com.dev.crm.entity.Privilege;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface PrivilegeRepository extends JpaRepository<Privilege, Long> {

    Optional<Privilege> findByName(String name);

    boolean existsByName(String name);

    List<Privilege> findByCategory(String category);

    @Query("SELECT p FROM Privilege p WHERE p.id IN :ids")
    Set<Privilege> findByIdIn(@Param("ids") Set<Long> ids);

    @Query("SELECT DISTINCT p.category FROM Privilege p ORDER BY p.category")
    List<String> findAllCategories();

    @Query("SELECT COUNT(r) FROM Role r JOIN r.privileges p WHERE p.id = :privilegeId")
    long countRolesByPrivilege(@Param("privilegeId") Long privilegeId);
}
