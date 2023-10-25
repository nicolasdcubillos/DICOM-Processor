package puj.backend_gui_nodules.rest;

import puj.backend_gui_nodules.model.UserTypeDTO;
import puj.backend_gui_nodules.service.UserTypeService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/api-ms-admon/tipoUsuarios", produces = MediaType.APPLICATION_JSON_VALUE)
public class UserTypeResource {

    private final UserTypeService userTypeService;

    public UserTypeResource(final UserTypeService userTypeService) {
        this.userTypeService = userTypeService;
    }

    @GetMapping
    public ResponseEntity<List<UserTypeDTO>> getAllTipoUsuarios() {
        return ResponseEntity.ok(userTypeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserTypeDTO> getTipoUsuario(@PathVariable final Integer id) {
        return ResponseEntity.ok(userTypeService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createTipoUsuario(
            @RequestBody @Valid final UserTypeDTO userTypeDTO) {
        final Integer createdId = userTypeService.create(userTypeDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateTipoUsuario(@PathVariable final Integer id,
                                                     @RequestBody @Valid final UserTypeDTO userTypeDTO) {
        userTypeService.update(id, userTypeDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTipoUsuario(@PathVariable final Integer id) {
        userTypeService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
