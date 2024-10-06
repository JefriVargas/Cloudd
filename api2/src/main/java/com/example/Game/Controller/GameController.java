package com.example.Game.Controller;

import com.example.Game.Domain.Game;
import com.example.Game.Repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/games")
public class GameController {

    @Autowired
    private GameRepository gameRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllGames() {
        List<Game> games = gameRepository.findAll();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("games", games);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getGameById(@PathVariable Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("game", game);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createGame(@RequestBody Game game) {
        Game newGame = gameRepository.save(game);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("game", newGame);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateGame(@PathVariable Long id, @RequestBody Game gameDetails) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found"));

        if (gameDetails.getName() != null) {
            game.setName(gameDetails.getName());
        }
        if (gameDetails.getPublicationDate() != null) {
            game.setPublicationDate(gameDetails.getPublicationDate());
        }
        if (gameDetails.getCategory() != null) {
            game.setCategory(gameDetails.getCategory());
        }
        if (gameDetails.getSize() != null) {
            game.setSize(gameDetails.getSize());
        }

        Game updatedGame = gameRepository.save(game);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("game", updatedGame);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteGame(@PathVariable Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found"));

        gameRepository.delete(game);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Game deleted successfully");

        return ResponseEntity.ok(response);
    }
}
