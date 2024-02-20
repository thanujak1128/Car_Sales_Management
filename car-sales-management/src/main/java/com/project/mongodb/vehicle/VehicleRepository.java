package com.project.mongodb.vehicle;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VehicleRepository extends MongoRepository<Vehicle, String> {

	public List<Vehicle> findBySellerId(String sellerId);

	public List<Vehicle> findByStatusAndPurchaseStatus(String status, String purchaseStatus);

	public List<Vehicle> findAll(Sort sort);

	public List<Vehicle> findByCarNameIsLikeIgnoreCase(String carName);

	public List<Vehicle> findByCarNameIsLikeIgnoreCaseAndSellerId(String carName, String sellerId);
	
	public List<Vehicle> findByCarNameIsLikeIgnoreCaseAndStatus(String carName, String status);

	public List<Vehicle> findByStatusIn(List<String> statusList);

	public List<Vehicle> findByStatusInAndSellerId(List<String> statusList, String sellerId);

	public Long countBySellerId(String sellerId);

}
