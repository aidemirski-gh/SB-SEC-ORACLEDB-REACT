package com.dev.crm.service;

import com.dev.crm.dto.CustomerCreateDTO;
import com.dev.crm.dto.CustomerDTO;
import com.dev.crm.dto.CustomerUpdateDTO;
import com.dev.crm.entity.Customer;
import com.dev.crm.exception.ResourceConflictException;
import com.dev.crm.exception.ResourceNotFoundException;
import com.dev.crm.mapper.CustomerMapper;
import com.dev.crm.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final MessageSource messageSource;

    /**
     * Get all customers
     * Demonstrates: Entity to DTO list mapping
     */
    @Transactional(readOnly = true)
    public List<CustomerDTO> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        return customerMapper.toDTOList(customers);
    }

    /**
     * Get customer by ID
     * Demonstrates: Entity to DTO mapping
     */
    @Transactional(readOnly = true)
    public CustomerDTO getCustomerById(Long id) {
        Locale locale = LocaleContextHolder.getLocale();
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> {
                String message = messageSource.getMessage("error.customer.notfound", new Object[]{id}, locale);
                return new ResourceNotFoundException(message);
            });
        return customerMapper.toDTO(customer);
    }

    /**
     * Create new customer
     * Demonstrates: CreateDTO to Entity mapping
     */
    public CustomerDTO createCustomer(CustomerCreateDTO createDTO) {
        Locale locale = LocaleContextHolder.getLocale();
        if (customerRepository.existsByEmail(createDTO.getEmail())) {
            String message = messageSource.getMessage("error.customer.exists", new Object[]{createDTO.getEmail()}, locale);
            throw new ResourceConflictException(message);
        }

        Customer customer = customerMapper.toEntity(createDTO);
        Customer savedCustomer = customerRepository.save(customer);
        return customerMapper.toDTO(savedCustomer);
    }

    /**
     * Update customer
     * Demonstrates: UpdateDTO to Entity mapping with @MappingTarget
     */
    public CustomerDTO updateCustomer(Long id, CustomerUpdateDTO updateDTO) {
        Locale locale = LocaleContextHolder.getLocale();
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> {
                String message = messageSource.getMessage("error.customer.notfound", new Object[]{id}, locale);
                return new ResourceNotFoundException(message);
            });

        // Check email uniqueness if email is being updated
        if (updateDTO.getEmail() != null &&
            !updateDTO.getEmail().equals(customer.getEmail()) &&
            customerRepository.existsByEmail(updateDTO.getEmail())) {
            String message = messageSource.getMessage("error.customer.exists", new Object[]{updateDTO.getEmail()}, locale);
            throw new ResourceConflictException(message);
        }

        customerMapper.updateEntityFromDTO(updateDTO, customer);
        Customer updatedCustomer = customerRepository.save(customer);
        return customerMapper.toDTO(updatedCustomer);
    }

    /**
     * Partial update customer
     * Demonstrates: Partial update using NullValuePropertyMappingStrategy.IGNORE
     */
    public CustomerDTO partialUpdateCustomer(Long id, CustomerUpdateDTO updateDTO) {
        Locale locale = LocaleContextHolder.getLocale();
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> {
                String message = messageSource.getMessage("error.customer.notfound", new Object[]{id}, locale);
                return new ResourceNotFoundException(message);
            });

        customerMapper.partialUpdate(updateDTO, customer);
        Customer updatedCustomer = customerRepository.save(customer);
        return customerMapper.toDTO(updatedCustomer);
    }

    /**
     * Delete customer
     */
    public void deleteCustomer(Long id) {
        Locale locale = LocaleContextHolder.getLocale();
        if (!customerRepository.existsById(id)) {
            String message = messageSource.getMessage("error.customer.notfound", new Object[]{id}, locale);
            throw new ResourceNotFoundException(message);
        }
        customerRepository.deleteById(id);
    }
}
