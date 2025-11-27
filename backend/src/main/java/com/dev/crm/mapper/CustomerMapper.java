package com.dev.crm.mapper;

import com.dev.crm.dto.CustomerCreateDTO;
import com.dev.crm.dto.CustomerDTO;
import com.dev.crm.dto.CustomerUpdateDTO;
import com.dev.crm.entity.Customer;
import org.mapstruct.*;

import java.util.List;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface CustomerMapper {

    /**
     * Convert Customer entity to CustomerDTO
     */
    CustomerDTO toDTO(Customer customer);

    /**
     * Convert list of Customer entities to list of CustomerDTOs
     */
    List<CustomerDTO> toDTOList(List<Customer> customers);

    /**
     * Convert CustomerCreateDTO to Customer entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Customer toEntity(CustomerCreateDTO createDTO);

    /**
     * Update existing Customer entity from CustomerUpdateDTO
     * Only non-null fields from DTO will be mapped to the entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(CustomerUpdateDTO updateDTO, @MappingTarget Customer customer);

    /**
     * Partial update - update only specified fields
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void partialUpdate(CustomerUpdateDTO updateDTO, @MappingTarget Customer customer);
}
