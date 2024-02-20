package com.project.mongodb.controller;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.mongodb.constants.CommonConstants;
import com.project.mongodb.enums.UserRolesEnum;
import com.project.mongodb.exception.ResourceNotFoundException;
import com.project.mongodb.order.OrderRequest;
import com.project.mongodb.order.OrderRequestRepository;
import com.project.mongodb.user.User;
import com.project.mongodb.user.admin.Admin;
import com.project.mongodb.user.admin.AdminRepository;
import com.project.mongodb.user.buyer.Buyer;
import com.project.mongodb.user.buyer.BuyerRepository;
import com.project.mongodb.user.seller.Seller;
import com.project.mongodb.user.seller.SellerRepository;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

	@Autowired
	private BuyerRepository buyerRepository;

	@Autowired
	private SellerRepository sellerRepository;

	@Autowired
	private AdminRepository adminRepository;

	@Autowired
	private OrderRequestRepository orderRequestRepository;

	@PostMapping("/register")
	public ResponseEntity<String> register(@RequestBody User user) {
		UserRolesEnum userRole = getUserRole(user.getRole());
		if (userRole == UserRolesEnum.BUYER) {
			Buyer existingBuyer = buyerRepository.getBuyerByUsername(user.getUsername());
			if (existingBuyer == null) {
				Buyer buyer = new Buyer();
				BeanUtils.copyProperties(user, buyer);
				buyerRepository.save(buyer);
				return ResponseEntity.ok(CommonConstants.SUCCESSFULLY_REGISTERED);
			} else {
				return ResponseEntity.status(HttpStatus.CONFLICT).body(CommonConstants.USER_NAME_ALREADY_REGISTERED);
			}
		} else if (userRole == UserRolesEnum.SELLER) {
			Seller existingSeller = sellerRepository.getSellerByUsername(user.getUsername());
			if (existingSeller == null) {
				Seller seller = new Seller();
				BeanUtils.copyProperties(user, seller);
				sellerRepository.save(seller);
				return ResponseEntity.ok(CommonConstants.SUCCESSFULLY_REGISTERED);
			} else {
				return ResponseEntity.status(HttpStatus.CONFLICT).body(CommonConstants.USER_NAME_ALREADY_REGISTERED);
			}
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(CommonConstants.INVALID_USER_ROLE);
		}
	}

	@PostMapping("/login")
	public ResponseEntity<Object> login(@RequestBody User user) {
		UserRolesEnum userRole = getUserRole(user.getRole());
		ResponseEntity<Object> responseEntity = null;
		if (userRole == UserRolesEnum.BUYER) {
			responseEntity = authenticateAndRespond(user, buyerRepository.getBuyerByUsername(user.getUsername()));
		} else if (userRole == UserRolesEnum.SELLER) {
			responseEntity = authenticateAndRespond(user, sellerRepository.getSellerByUsername(user.getUsername()));
		} else if (userRole == UserRolesEnum.ADMIN) {
			responseEntity = authenticateAndRespond(user, adminRepository.getAdminByUsername(user.getUsername()));
		}
		if (responseEntity == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(CommonConstants.INTERNAL_SERVER_ERROR);
		}
		return responseEntity;
	}

	private ResponseEntity<Object> authenticateAndRespond(User userRequest, User userDetails) {
		if (userDetails == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(CommonConstants.USER_NOT_FOUND);
		} else if (!userDetails.getPassword().equals(userRequest.getPassword())) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(CommonConstants.INCORRECT_PASSWORD);
		} else {
			return ResponseEntity.ok(userDetails);
		}
	}

	private UserRolesEnum getUserRole(String role) {
		return UserRolesEnum.getUserRolesEnum(role);
	}

	@PostMapping("addBalance/{userId}")
	public ResponseEntity<Object> addBalance(@PathVariable String userId, @RequestParam("userRole") String userRole,
			@RequestParam("amount") String amount) {
		UserRolesEnum role = getUserRole(userRole);
		if (role == UserRolesEnum.BUYER) {
			Buyer buyerDetails = buyerRepository.findById(userId)
					.orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
			buyerDetails.setBalance(buyerDetails.getBalance() + Double.valueOf(amount));
			Buyer buyerResponse = buyerRepository.save(buyerDetails);
			return ResponseEntity.ok(buyerResponse);
		} else if (role == UserRolesEnum.SELLER) {
			Seller sellerDetails = sellerRepository.findById(userId)
					.orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
			sellerDetails.setBalance(sellerDetails.getBalance() + Double.valueOf(amount));
			Seller sellerResponse = sellerRepository.save(sellerDetails);
			return ResponseEntity.ok(sellerResponse);
		} else {
			Admin adminDetails = adminRepository.findById(userId)
					.orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
			adminDetails.setBalance(adminDetails.getBalance() + Double.valueOf(amount));
			Admin adminResponse = adminRepository.save(adminDetails);
			return ResponseEntity.ok(adminResponse);
		}
	}

	@GetMapping("getUserDetails")
	public ResponseEntity<Object> getVehicles(@RequestParam String userId, @RequestParam String userRole) {
		UserRolesEnum role = getUserRole(userRole);
		if (role == UserRolesEnum.SELLER) {
			Seller sellerDetails = sellerRepository.findById(userId)
					.orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
			return ResponseEntity.ok(sellerDetails);
		} else if (role == UserRolesEnum.BUYER) {
			Buyer buyerDetails = buyerRepository.findById(userId)
					.orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
			return ResponseEntity.ok(buyerDetails);
		} else {
			Admin adminDetails = adminRepository.findById(userId)
					.orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
			return ResponseEntity.ok(adminDetails);
		}
	}

	@GetMapping("getUserRequests")
	public ResponseEntity<List<String>> getUserRequests(@RequestParam String userId) {
		List<OrderRequest> orderRequests = orderRequestRepository.findByBuyerIdAndOrderStatusOrOrderStatus(userId, "I", "A");
		if(orderRequests.isEmpty()) {
			return new ResponseEntity<>(Collections.emptyList(), HttpStatus.OK);
		}
		List<String> vehicleIds = orderRequests.stream().map(eachOrderRequest -> eachOrderRequest.getVehicle().getId()).collect(Collectors.toList());
		return new ResponseEntity<>(vehicleIds, HttpStatus.OK);
	}
}
