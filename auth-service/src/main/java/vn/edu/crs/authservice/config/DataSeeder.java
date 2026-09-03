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
        String testKey = "ak_live_d85rixlbhjqix0b4";

        // Kiểm tra xem key test đã tồn tại trong DB chưa
        boolean exists = apiKeyRepository.findAll().stream()
                .anyMatch(k -> testKey.equals(k.getKeyValue()));

        if (!exists) {
            ApiKey apiKey = new ApiKey();
            apiKey.setKeyValue(testKey);
            apiKey.setOwnerName("Doi tac Test");
            apiKey.setScopes("courses:read");
            apiKey.setStatus("ACTIVE");
            apiKey.setExpiresAt(LocalDateTime.now().plusDays(30));
            apiKey.setCreatedAt(LocalDateTime.now());

            apiKeyRepository.save(apiKey);
            System.out.println(">>> [DataSeeder] Đã chèn thành công API Key test: " + testKey);
        }
    }
}