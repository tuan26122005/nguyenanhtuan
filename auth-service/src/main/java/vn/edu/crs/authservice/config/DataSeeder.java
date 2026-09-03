package vn.edu.crs.authservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import vn.edu.crs.authservice.entity.ApiKey;
import vn.edu.crs.authservice.repository.ApiKeyRepository;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ApiKeyRepository apiKeyRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. API Key chỉ có quyền Đọc (Test 3 -> Test 7)
        seedKeyIfNotExist("ak_live_d85rixlbhjqix0b4", "Doi tac ReadOnly", "courses:read");

        // 2. API Key có đầy đủ quyền Ghi (Dùng cho Test 8)
        seedKeyIfNotExist("ak_live_write_valid_8888", "Doi tac Write", "courses:read,courses:write");
    }

    private void seedKeyIfNotExist(String keyValue, String ownerName, String scopes) {
        boolean exists = apiKeyRepository.findAll().stream()
                .anyMatch(k -> keyValue.equals(k.getKeyValue()));

        if (!exists) {
            ApiKey apiKey = new ApiKey();
            apiKey.setKeyValue(keyValue);
            apiKey.setOwnerName(ownerName);
            apiKey.setScopes(scopes);
            apiKey.setStatus("ACTIVE");
            apiKey.setExpiresAt(LocalDateTime.now().plusDays(30));
            apiKey.setCreatedAt(LocalDateTime.now());

            apiKeyRepository.save(apiKey);
            System.out.println(">>> [DataSeeder] Đã chèn thành công API Key: " + keyValue + " | Scopes: " + scopes);
        }
    }
}