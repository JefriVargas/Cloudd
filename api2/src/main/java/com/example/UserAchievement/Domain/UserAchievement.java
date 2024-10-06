package com.example.UserAchievement.Domain;

import com.example.Achievement.Domain.Achievement;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Entity
public class UserAchievement {

    @EmbeddedId
    private UserAchievementId id;

    @ManyToOne
    @MapsId("achievementId")
    @JoinColumn(name = "achievement_id")
    @JsonIgnore
    private Achievement achievement;

    public UserAchievement() {}

    public UserAchievement(Long userId, Achievement achievement) {
        this.id = new UserAchievementId(userId, achievement.getId());
        this.achievement = achievement;
    }

    @Embeddable
    @Getter
    @Setter
    public static class UserAchievementId implements Serializable {

        @Column(name = "user_id")
        private Long userId;

        @Column(name = "achievement_id")
        private Long achievementId;

        public UserAchievementId() {}

        public UserAchievementId(Long userId, Long achievementId) {
            this.userId = userId;
            this.achievementId = achievementId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            UserAchievementId that = (UserAchievementId) o;
            return Objects.equals(userId, that.userId) && Objects.equals(achievementId, that.achievementId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(userId, achievementId);
        }
    }
}
