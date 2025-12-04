package com.dev.crm.mapper;

import com.dev.crm.dto.RoleCreateDTO;
import com.dev.crm.dto.RoleDTO;
import com.dev.crm.dto.RoleUpdateDTO;
import com.dev.crm.entity.Role;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    @Mapping(target = "userCount", ignore = true)
    RoleDTO toDTO(Role role);

    List<RoleDTO> toDTOList(List<Role> roles);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "systemRole", constant = "false")
    @Mapping(target = "users", ignore = true)
    @Mapping(target = "privileges", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Role toEntity(RoleCreateDTO createDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "systemRole", ignore = true)
    @Mapping(target = "users", ignore = true)
    @Mapping(target = "privileges", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(RoleUpdateDTO updateDTO, @MappingTarget Role role);
}
