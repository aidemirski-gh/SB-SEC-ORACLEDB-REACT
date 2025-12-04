package com.dev.crm.mapper;

import com.dev.crm.dto.UserDTO;
import com.dev.crm.entity.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {RoleMapper.class})
public interface UserMapper {

    UserDTO toDTO(User user);

    List<UserDTO> toDTOList(List<User> users);
}
