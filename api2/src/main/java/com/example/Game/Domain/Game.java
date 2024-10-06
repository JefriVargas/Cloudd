package com.example.Game.Domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.example.Achievement.Domain.Achievement;

@Getter
@Setter
@Entity
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    private String name;
    private LocalDate publicationDate;
    private String category;
    private Integer size;

    @OneToMany(mappedBy = "game")
    private List<Achievement> achievements = new ArrayList<>();
}
