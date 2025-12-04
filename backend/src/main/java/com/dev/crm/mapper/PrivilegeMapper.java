package com.dev.crm.mapper;

import com.dev.crm.dto.PrivilegeCreateDTO;
import com.dev.crm.dto.PrivilegeDTO;
import com.dev.crm.dto.PrivilegeUpdateDTO;
import com.dev.crm.entity.Privilege;
import org.mapstruct.*;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface PrivilegeMapper {

    @Mapping(target = "roleCount", ignore = true)
    PrivilegeDTO toDTO(Privilege privilege);

    List<PrivilegeDTO> toDTOList(List<Privilege> privileges);

    Set<PrivilegeDTO> toDTOSet(Set<Privilege> privileges);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Privilege toEntity(PrivilegeCreateDTO createDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(PrivilegeUpdateDTO updateDTO, @MappingTarget Privilege privilege);
}
