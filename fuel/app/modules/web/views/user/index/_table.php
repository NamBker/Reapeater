<div class="col-sm-10 col-sm-offset-1">
<table class="table table-striped">
    <thead>
    <tr>
        <?php foreach ($lable as $value) {
            echo "<th>$value</th>";
        } ?>
    </tr>
    </thead>
    <tbody>
    <?php foreach ($users as $row => $user) : ?>
        <tr>
            <?php foreach ($lable as $key => $value) {
                echo "<td>$user[$key]</td>";
            } ?>
        </tr>
    <?php endforeach; ?>
    </tbody>
</table>
</div>