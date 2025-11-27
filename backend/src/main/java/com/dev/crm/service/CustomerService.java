package com.dev.crm.service;

import com.dev.crm.dto.CustomerCreateDTO;
import com.dev.crm.dto.CustomerDTO;
import com.dev.crm.dto.CustomerUpdateDTO;
import com.dev.crm.entity.Customer;
import com.dev.crm.mapper.CustomerMapper;
import com.dev.crm.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

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
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        return customerMapper.toDTO(customer);
    }

    /**
     * Create new customer
     * Demonstrates: CreateDTO to Entity mapping
     */
    public CustomerDTO createCustomer(CustomerCreateDTO createDTO) {
        if (customerRepository.existsByEmail(createDTO.getEmail())) {
            throw new RuntimeException("Customer already exists with email: " + createDTO.getEmail());
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
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        // Check email uniqueness if email is being updated
        if (updateDTO.getEmail() != null &&
            !updateDTO.getEmail().equals(customer.getEmail()) &&
            customerRepository.existsByEmail(updateDTO.getEmail())) {
            throw new RuntimeException("Customer already exists with email: " + updateDTO.getEmail());
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
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        customerMapper.partialUpdate(updateDTO, customer);
        Customer updatedCustomer = customerRepository.save(customer);
        return customerMapper.toDTO(updatedCustomer);
    }

    /**
     * Delete customer
     */
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }
}
