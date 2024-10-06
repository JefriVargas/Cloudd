package com.example.UserAchievement.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.example.UserAchievement.Domain.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {
  @Query("SELECT ua.id.achievementId, a.name, a.rarity, g.name FROM UserAchievement ua " +
           "JOIN ua.achievement a " +
           "JOIN a.game g " +
           "WHERE ua.id.userId = :userId")
    List<Object[]> findAchievementsByUserIdWithGameName(Long userId);
}
