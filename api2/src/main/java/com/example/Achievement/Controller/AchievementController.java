package com.example.Achievement.Controller;

import com.example.Achievement.Domain.Achievement;
import com.example.Achievement.Repository.AchievementRepository;
import com.example.Game.Domain.Game;
import com.example.Game.Repository.GameRepository;
import com.example.UserAchievement.Domain.UserAchievement;
import com.example.UserAchievement.Domain.UserAchievement.UserAchievementId;
import com.example.UserAchievement.Repository.UserAchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/achievements")
public class AchievementController {

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private UserAchievementRepository userAchievementRepository;

    private final String USER_SERVICE_URL = "http://api1:8000/user/";

    @PostMapping("/create/{gameId}")
    public ResponseEntity<Map<String, Object>> createAchievement(@PathVariable Long gameId, @RequestBody Achievement achievementDetails) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found"));

        Achievement achievement = new Achievement();
        achievement.setName(achievementDetails.getName());
        achievement.setRarity(achievementDetails.getRarity());
        achievement.setGame(game);

        Achievement newAchievement = achievementRepository.save(achievement);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("achievement", newAchievement);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getAchievementsByUserId(@PathVariable Long userId) {
        List<Object[]> userAchievements = userAchievementRepository.findAchievementsByUserIdWithGameName(userId);

        if (userAchievements.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No achievements found for user");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("achievements", userAchievements.stream().map(achievement -> {
            Map<String, Object> achievementMap = new HashMap<>();
            achievementMap.put("achievement_id", achievement[0]);
            achievementMap.put("achievement_name", achievement[1]);
            achievementMap.put("rarity", achievement[2]);
            achievementMap.put("game_name", achievement[3]);
            return achievementMap;
        }));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{achievementId}/assign")
    public ResponseEntity<Map<String, Object>> assignAchievementToUser(
            @PathVariable Long achievementId, @RequestBody Map<String, Long> payload) {
        
        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Achievement not found"));

        Long userId = payload.get("user_id");
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "user_id is required");
        }

        RestTemplate restTemplate = new RestTemplate();
        String userUrl = USER_SERVICE_URL + userId;
        Map<String, Object> userResponse;
        
        try {
            userResponse = restTemplate.getForObject(userUrl, Map.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        UserAchievementId userAchievementId = new UserAchievementId(userId, achievementId);
        UserAchievement userAchievement = new UserAchievement();
        userAchievement.setId(userAchievementId);
        userAchievement.setAchievement(achievement);

        userAchievementRepository.save(userAchievement);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Achievement assigned to user");
        response.put("achievement", achievement);
        response.put("user_id", userId);

        return ResponseEntity.ok(response);
    }
}
