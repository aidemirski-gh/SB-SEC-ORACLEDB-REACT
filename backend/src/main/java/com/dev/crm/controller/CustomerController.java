package com.dev.crm.controller;

import com.dev.crm.dto.CustomerCreateDTO;
import com.dev.crm.dto.CustomerDTO;
import com.dev.crm.dto.CustomerUpdateDTO;
import com.dev.crm.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Customer REST Controller
 * Demonstrates MapStruct usage for entity-DTO conversions
 */
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    /**
     * Get all customers
     * MapStruct converts List<Customer> to List<CustomerDTO>
     */
    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        List<CustomerDTO> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    /**
     * Get customer by ID
     * MapStruct converts Customer entity to CustomerDTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable Long id) {
        CustomerDTO customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(customer);
    }

    /**
     * Create new customer
     * MapStruct converts CustomerCreateDTO to Customer entity
     * Then converts saved Customer entity back to CustomerDTO
     */
    @PostMapping
    public ResponseEntity<CustomerDTO> createCustomer(@Valid @RequestBody CustomerCreateDTO createDTO) {
        CustomerDTO customer = customerService.createCustomer(createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(customer);
    }

    /**
     * Update customer (full update)
     * MapStruct uses @MappingTarget to update existing entity
     */
    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(
        @PathVariable Long id,
        @Valid @RequestBody CustomerUpdateDTO updateDTO
    ) {
        CustomerDTO customer = customerService.updateCustomer(id, updateDTO);
        return ResponseEntity.ok(customer);
    }

    /**
     * Partial update customer
     * MapStruct updates only non-null fields from DTO
     */
    @PatchMapping("/{id}")
    public ResponseEntity<CustomerDTO> partialUpdateCustomer(
        @PathVariable Long id,
        @RequestBody CustomerUpdateDTO updateDTO
    ) {
        CustomerDTO customer = customerService.partialUpdateCustomer(id, updateDTO);
        return ResponseEntity.ok(customer);
    }

    /**
     * Delete customer
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
